import logging
import asyncio
import aiohttp
import random
from urllib.parse import urlparse, parse_qs, urlencode
from playwright.async_api import async_playwright, Browser, Page, Error as PlaywrightError
from module.matureJob.helper import extract_job_id, clean_url
from config.config import LINKEDIN_JOB_POSTING_API

class JobChecker:
    def __init__(self):
        self._playwright = None
        self.browser = None
        self.logger = logging.getLogger(self.__class__.__name__)

    async def init_browser(self) -> Browser:
        if not self.browser:
            try:
                self._playwright = await async_playwright().start()
                self.browser = await self._playwright.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-accelerated-2d-canvas",
                        "--disable-gpu",
                        "--window-size=1920x1080",
                    ],
                )
                self.logger.info("👾 Launched headless browser")
            except Exception as e:
                self.logger.error(f"Failed to initialize browser: {str(e)}")
                if self._playwright:
                    await self._playwright.stop()
                    self._playwright = None
                raise RuntimeError(f"Browser initialization failed: {str(e)}")
        return self.browser

    async def new_page(self) -> Page:
        try:
            browser = await self.init_browser()
            page = await browser.new_page()
            await page.route(
                "**/*",
                lambda r: r.abort() if r.request.resource_type in ("image", "stylesheet", "font", "media") else r.continue_()
            )
            # Set longer timeout for navigation (10-15 seconds)
            random_timeout = int(random.uniform(10000, 15000))
            page.set_default_navigation_timeout(random_timeout)
            return page
        except Exception as e:
            self.logger.error(f"Failed to create new page: {str(e)}")
            raise RuntimeError(f"Failed to create new page: {str(e)}")

    async def _check_job_via_api(self, jid: str) -> dict:
        """Check job application type using LinkedIn API."""
        try:
            api = f"{LINKEDIN_JOB_POSTING_API}/{jid}"
            async with aiohttp.ClientSession() as tmp:
                async with tmp.get(api, timeout=10) as resp:
                    text = await resp.text()
                    if resp.status == 200 and "applyMethod" in text:
                        return {
                            "isEasyApply": "EASY_APPLY" in text,
                            "hasCompanyWebsite": "EXTERNAL" in text,
                            "companyWebsiteUrl": "",
                        }
        except Exception as e:
            self.logger.debug(f"API fallback error: {str(e)}")
        return None

    async def _get_apply_button_info(self, page: Page) -> dict:
        """Get information about apply buttons on the page."""
        try:
            # Increased timeout for selector (5-8 seconds)
            random_timeout = int(random.uniform(5000, 8000))
            await page.wait_for_selector(
                'button[data-tracking-control-name*="public_jobs_apply-link"]',
                timeout=random_timeout,
            )
        except PlaywrightError as e:
            self.logger.debug(f"Selector not found for apply link button: {str(e)}")

        try:
            return await page.evaluate('''() => {
                const onsite = !!document.querySelector(
                    'button[data-tracking-control-name="public_jobs_apply-link-onsite"]'
                );
                const offsite = !!document.querySelector(
                    'button[data-tracking-control-name="public_jobs_apply-link-offsite_sign-up-modal"]'
                );
                return { isEasyApply: onsite, hasOffsiteButton: offsite };
            }''')
        except Exception as e:
            self.logger.error(f"Error evaluating page content: {str(e)}")
            return {"isEasyApply": False, "hasOffsiteButton": False}

    async def _get_company_website_url(self, page: Page) -> str:
        """Get company website URL from the dialog."""
        try:
            await page.click(
                'button[data-tracking-control-name="public_jobs_apply-link-offsite_sign-up-modal"]',
                force=True,
            )
            try:
                # Increased timeout for dialog (5-8 seconds)
                random_timeout = int(random.uniform(5000, 8000))
                await page.wait_for_selector("div[role=dialog]", timeout=random_timeout)
            except PlaywrightError as e:
                self.logger.debug(f"Dialog selector not found after clicking offsite button: {str(e)}")
                return ""

            # Wait for dialog to be fully loaded
            await asyncio.sleep(2)

            for _ in range(3):
                try:
                    href = await page.evaluate('''() => {
                        const direct = document.querySelector(
                            '.sign-up-modal__direct-apply-on-company-site a.sign-up-modal__company_webiste'
                        )?.href;
                        if (direct) return direct;
                        const modal = document.querySelector('div[role=dialog]');
                        if (!modal) return '';
                        const links = Array.from(modal.querySelectorAll('a'));
                        const pick = links.find(l => {
                            const t = l.textContent?.toLowerCase()||'';
                            const h = l.href||'';
                            return (t.includes('apply')||t.includes('application'))
                                && !h.includes('linkedin.com') && h.startsWith('http');
                        });
                        return pick?.href||'';
                    }''')
                    if href:
                        return clean_url(href)
                except Exception as e:
                    self.logger.debug(f"Error extracting URL attempt {_ + 1}: {str(e)}")
                await asyncio.sleep(2)
        except Exception as e:
            self.logger.error(f"Error getting company website URL: {str(e)}")
        return ""

    async def check_job_application_type(self, job_url: str) -> dict:
        """Check the type of job application (Easy Apply or Company Website)."""
        jid = extract_job_id(job_url)
        
        # Try API first
        if jid:
            try:
                api_result = await self._check_job_via_api(jid)
                if api_result:
                    return api_result
            except Exception as e:
                self.logger.debug(f"API check failed, falling back to browser: {str(e)}")

        # Fallback to browser-based check
        page = None
        try:
            page = await self.new_page()
            # Increased timeout for page load (10-15 seconds)
            random_timeout = int(random.uniform(10000, 15000))
            await page.goto(job_url, wait_until="domcontentloaded", timeout=random_timeout)
            await asyncio.sleep(2)  # Wait for dynamic content

            info = await self._get_apply_button_info(page)
            company_url = ""
            
            if not info["isEasyApply"] and info["hasOffsiteButton"]:
                company_url = await self._get_company_website_url(page)

            return {
                "isEasyApply": info["isEasyApply"],
                "hasCompanyWebsite": bool(company_url),
                "companyWebsiteUrl": company_url,
            }

        except PlaywrightError as e:
            self.logger.error(f"Browser error for {job_url}: {str(e)}")
            return {
                "isEasyApply": True,  # Default to Easy Apply on error
                "hasCompanyWebsite": False,
                "companyWebsiteUrl": ""
            }
        except Exception as e:
            self.logger.error(f"Unexpected error checking {job_url}: {str(e)}")
            return {
                "isEasyApply": True,
                "hasCompanyWebsite": False,
                "companyWebsiteUrl": ""
            }
        finally:
            if page:
                try:
                    await page.close()
                except Exception as e:
                    self.logger.error(f"Error closing page: {str(e)}")

    async def close(self):
        if self.browser:
            try:
                await self.browser.close()
            except Exception as e:
                self.logger.error(f"Error closing browser: {str(e)}")
        if self._playwright:
            try:
                await self._playwright.stop()
            except Exception as e:
                self.logger.error(f"Error stopping playwright: {str(e)}")
