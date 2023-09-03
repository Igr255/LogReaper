/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Message-highlighting.feature file.
 **/

using System;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using NUnit.Framework;
using OpenQA.Selenium;
using static System.Net.Mime.MediaTypeNames;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Message-highlighting")]
    public class LogMessagePatternHighlightTest : CommonTest
    {
        private string text = "Line1\nLine2\nLine3";

        // Background:
        //   Given the User inserted a log
        //   And two log message patterns are created
        [SetUp]
        public void SetMainText()
        {
            App.SetMainText(text);

            App.SetFilterText("Line2");
            App.ClickFilterExportButton();
            Thread.Sleep(2 * 1000);
            App.SetMessagePatternText(1, "TestPattern");
            Thread.Sleep(2 * 1000);
            Assert.True(App.GetMessagePatternCount() == 1);

            App.SetFilterText("Line2");
            App.ClickFilterExportButton();
            Thread.Sleep(2 * 1000);
            App.SetMessagePatternText(2, "TestPattern2");
            Thread.Sleep(2 * 1000);
            Assert.True(App.GetMessagePatternCount() == 2);
        }

        //** Scenario: Highlighting log messages using one message pattern **//
        [Test]
        public void HighlightLogMessageOnePattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User selects a message pattern by clicking a checkbox
            App.ClickMessagePatternCheckBox(1);
            Thread.Sleep(2 * 1000);

            Assert.True(App.getMainText() == "Line2");

            // Then the matched log messages will be highlighted with a light red bar
            Thread.Sleep(2 * 1000);
            var highlightedLogMessage = By.XPath("//*[contains(@style,'background: linear-gradient(90deg, rgba(253,29,29,0.3) 0.3%, rgba(252,176,69,0) 0.3%)')]");
            var textLineArray = App.browserDriver.driverWait?.Until(drv => drv.FindElements(highlightedLogMessage));
            Assert.True(textLineArray?.Count == 1);
        }

        //** Scenario: Highlighting log messages using multiple message patterns **//
        [Test]
        public void HighlightLogMessageMultiplePatterns([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User selects two message patterns by clicking their checkboxes
            App.ClickMessagePatternCheckBox(1);
            Thread.Sleep(2 * 1000);
            App.ClickMessagePatternCheckBox(2);
            Thread.Sleep(2 * 1000);

            Assert.True(App.getMainText() == "Line2");

            // Then the matched log messages will be highlighted with a darker red bar
            Thread.Sleep(2 * 1000);
            var highlightedLogMessage = By.XPath("//*[contains(@style,'background: linear-gradient(90deg, rgba(253,29,29,0.6) 0.3%, rgba(252,176,69,0) 0.3%)')]");
            var textLineArray = App.browserDriver.driverWait?.Until(drv => drv.FindElements(highlightedLogMessage));
            Assert.True(textLineArray?.Count == 1);
        }
    }
}

