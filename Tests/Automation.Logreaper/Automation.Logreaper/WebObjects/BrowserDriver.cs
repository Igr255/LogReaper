/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Selenium WebDriver initialization.
 **/

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Safari;
using OpenQA.Selenium.Support.UI;
using System;

namespace Automation.Webs.WebObjects {
    public enum BrowserType
    {
        Chrome,
        Safari
    }

    public class BrowserDriver {
		public IWebDriver? driver;
		public WebDriverWait? driverWait;
		
		public BrowserType DriverType {
			get;
			set;
		}

		public BrowserDriver(BrowserType browserType) {
			DriverType = browserType;
		}

		public void Start() {
			if (DriverType == BrowserType.Chrome) {
				ChromeOptions options = new ChromeOptions();
				options.AddArgument("--start-maximized");
				driver = new ChromeDriver(options);
			}
			else {
                driver = new SafariDriver();
				driver.Manage().Window.Maximize();
			}
            driver.Navigate().GoToUrl("http://localhost:3000/");
            driverWait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            
		}

		public void Close() {
			if (driver != null)
			{
				driver.Close();
				driver.Quit();
			}
		}

	}
}