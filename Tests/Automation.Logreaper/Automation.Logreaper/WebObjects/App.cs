/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Individual operations over the application's instance.
 **/

using System;
using System.Reflection.Metadata;
using System.Xml.Linq;
using Automation.Webs.WebObjects;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using SeleniumExtras.PageObjects;

namespace Automation.Logreaper.WebObjects
{
    public class App
    {
        public BrowserDriver browserDriver;

        public App(BrowserType browserType)
        {
            browserDriver = new BrowserDriver(browserType);
            browserDriver.Start();
        }

        public void SetFilterText(string text)
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var filterElement = By.XPath("//*[@id='filter']//*[contains(@class, 'cm-line')]");
                browserDriver.driverWait.Until(drv => drv.FindElement(filterElement)).Click();
                browserDriver.driverWait.Until(drv => drv.FindElement(filterElement)).Clear();
                browserDriver.driverWait.Until(drv => drv.FindElement(filterElement)).SendKeys(text);
                Thread.Sleep(5 * 1000);
            }
        }

        public string GetFilterText()
        {
            string text = string.Empty;

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var filterElement = By.XPath("//*[@id='filter']//*[contains(@class, 'cm-line')]");
                text = browserDriver.driverWait.Until(drv => drv.FindElement(filterElement)).Text;
                Thread.Sleep(5 * 1000);
            }

            return text;
        }

        public void SetMainText(string text)
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var mainTextElement = By.XPath("(//*[@id='main-text']//*[@class='cm-content']//*[contains(@class, 'cm-activeLine')])");

                browserDriver.driverWait.Until(drv => drv.FindElement(mainTextElement)).Click();
                browserDriver.driverWait.Until(drv => drv.FindElement(mainTextElement)).Clear();
                browserDriver.driverWait.Until(drv => drv.FindElement(mainTextElement)).SendKeys(text);
            }
        }

        public void HighlightMainText()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var mainTextElement = By.XPath("(//*[@id='main-text']//*[@class='cm-content']//*[contains(@class, 'cm-activeLine')])");

                browserDriver.driverWait.Until(drv => drv.FindElement(mainTextElement)).SendKeys(Keys.Command + "a");
            }
        }

        public string getMainText()
        {
            string text = string.Empty;

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var mainTextElement = By.XPath("//*[@id='main-text']//*[@class='cm-content']//*[contains(@class, 'cm-line')]");
                var textLineArray = browserDriver.driverWait.Until(drv => drv.FindElements(mainTextElement));

                // retrieve text
                foreach (var line in textLineArray) {
                    text += line.Text + "\n";
                }
                text = text.Remove(text.Length - 1);
            }

            return text;
        }

        public void ClickFilterExportButton()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var exportButton = By.XPath("//*[@id='button-wrapper']/button");
                browserDriver.driverWait.Until(drv => drv.FindElement(exportButton)).Click();
            }
        }

        public int GetMessagePatternCount()
        {
            // (//*[@class='tool-bar-pattern'])[1]
            int elementCount = 0;

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var messagePatterns = By.XPath("//*[@class='tool-bar-pattern']");
                elementCount = browserDriver.driverWait.Until(drv => drv.FindElements(messagePatterns)).Count();
            }

            return elementCount;
        }

        // indexing starts at 1
        public string GetMessagePatternText(int pattenNumber)
        {
            int patternCount = GetMessagePatternCount();

            if (pattenNumber > patternCount)
                throw new Exception("Pattern count does not match");

            string patternText = string.Empty;

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var messagePattern = By.XPath($"(//*[@class='tool-bar-pattern'])[{pattenNumber}]/input");
                patternText = browserDriver.driverWait.Until(drv => drv.FindElement(messagePattern)).GetAttribute("value");
            }

            return patternText;
        }

        public void SetMessagePatternText(int pattenNumber, string text)
        {
            int patternCount = GetMessagePatternCount();

            if (pattenNumber > patternCount)
                throw new Exception("Pattern count does not match");

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var messagePattern = By.XPath($"(//*[@class='tool-bar-pattern'])[{pattenNumber}]/input");
                browserDriver.driverWait.Until(drv => drv.FindElement(messagePattern)).Clear();
                browserDriver.driverWait.Until(drv => drv.FindElement(messagePattern)).Clear();
                browserDriver.driverWait.Until(drv => drv.FindElement(messagePattern)).SendKeys(text);
            }
        }

        public void ClickMessagePatternCheckBox(int patternNumber)
        {
            int patternCount = GetMessagePatternCount();

            if (patternNumber > patternCount)
                throw new Exception("Pattern count does not match");

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var messagePatternCheckBox = By.XPath($"((//*[@class='tool-bar-pattern'])[{patternNumber}]//*[@class='pattern-selection'])[1]/span");
                browserDriver.driverWait.Until(drv => drv.FindElement(messagePatternCheckBox)).Click();
            }
        }

        public void ClickMessagePatternExport(int patternNumber)
        {
            int patternCount = GetMessagePatternCount();
            if (patternNumber > patternCount)
                throw new Exception("Pattern count does not match");

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var messagePatternButton = By.XPath($"(//*[@class='tool-bar-pattern'])[{patternNumber}]/div/button");
                browserDriver.driverWait.Until(drv => drv.FindElement(messagePatternButton)).Click();
            }
        }

        public void ExpandMessagePatternSubPatterns(int patternNumber)
        {
            int patternCount = GetMessagePatternCount();

            if (patternNumber > patternCount)
                throw new Exception("Pattern count does not match");
            
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var subPatternTree = By.XPath($"(//*[@class='tool-bar-pattern'])[{patternNumber}]//*[contains(@class, 'MuiTreeItem-label')]");
                browserDriver.driverWait.Until(drv => drv.FindElement(subPatternTree)).Click();
                Thread.Sleep(1 * 1000);
            }
        }

        public List<string> GetMessagePatternSubPatternTypes(int patternNumber)
        {
            int patternCount = GetMessagePatternCount();

            if (patternNumber > patternCount)
                throw new Exception("Pattern count does not match");

            List<string> subPattenTypes = new();
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var subpatternTypes = By.XPath($"(//*[@class='tool-bar-pattern'])[{patternNumber}]//*[@class='sequence-patterns']//*[@class='pattern-type']");
                var subPatternTypeArray = browserDriver.driverWait.Until(drv => drv.FindElements(subpatternTypes));

                foreach (var line in subPatternTypeArray)
                {
                    subPattenTypes.Add(line.Text);
                }
            }

            return subPattenTypes;
        }

        public string GetExportText()
        {
            Thread.Sleep(2 * 1000);
            string modeText = string.Empty;
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var mode = By.XPath($"//*[@id='modal-text']");
                modeText = browserDriver.driverWait.Until(drv => drv.FindElement(mode)).Text;
            }

            return modeText;
        }

        public string GetEditorMode()
        {
            Thread.Sleep(1000);
            string exportText = string.Empty;
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var exportButton = By.XPath($"//*[@id='mode-display']");
                exportText = browserDriver.driverWait.Until(drv => drv.FindElement(exportButton)).Text;
            }

            return exportText;
        }

        public void PressExportButton()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var exportButton = By.XPath($"//*[@id='options']/button");
                browserDriver.driverWait.Until(drv => drv.FindElement(exportButton)).Click();
            }
        }

        public bool IsPopupVisible()
        {
            bool isVisible = false;

            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var popup = By.XPath($"//*[@id='popup']");
                isVisible = browserDriver.driverWait.Until(drv => drv.FindElement(popup)).Displayed;
            }

            return isVisible;
        }

        public void PopupUseAsRegex()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var popupUseAsRe = By.XPath($"(//*[@id='popup']//*[text()='Use as regex'])");
                browserDriver.driverWait.Until(drv => drv.FindElement(popupUseAsRe)).Click();
            }
        }

        public void PopupUseGrok(string name)
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var popupUseAsRe = By.XPath($"(//*[@id='popup']//*[text()='{name}'])");
                browserDriver.driverWait.Until(drv => drv.FindElement(popupUseAsRe)).Click();
            }
        }

        public int GetValidGrokCount()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var grokHighlight = By.XPath($"//*[@class='grokHighlight']");
                var validGroks = browserDriver.driverWait.Until(drv => drv.FindElements(grokHighlight));

                return validGroks.Count();
            }

            return 0;
        }

        public int GetValidParamReCount()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var paramReHighlight = By.XPath($"//*[@class='paramReHighlight']");
                var validParamRe = browserDriver.driverWait.Until(drv => drv.FindElements(paramReHighlight));

                return validParamRe.Count();
            }

            return 0;
        }

        public void SelectGrokSet(string name)
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var grokSelection = By.XPath($"//*[@class='pattern-set-data']/div[text()='{name}']/following-sibling::span");
                browserDriver.driverWait.Until(drv => drv.FindElement(grokSelection)).Click();
            }
        }

        public string GetMessageCounterValue()
        {
            if (browserDriver != null && browserDriver.driver != null && browserDriver.driverWait != null)
            {
                var messageCounter = By.XPath($"//*[@id='line-display']");
                return browserDriver.driverWait.Until(drv => drv.FindElement(messageCounter)).Text;
            }

            return "";
        }
        
        public void Kill()
        {
            if (browserDriver != null)
                browserDriver.Close();
        }
    }
}

