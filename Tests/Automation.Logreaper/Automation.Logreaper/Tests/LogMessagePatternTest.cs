/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Log-message-pattern-operations.feature file.
 **/

using System;
using Automation.Webs.WebObjects;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Log-message-pattern-operations")]
    public class LogMessagePatternTest : CommonTest
	{
        private string text = "Line1\nLine2\nLine3";

        // Background:
        //   Given the User inserted a log
        [SetUp]
        public void SetMainText()
        {
            App.SetMainText(text);
        }

        //** Scenario: Creating a message pattern and naming it **//
        [Test]
        public void CreatingLogMessagePattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a pattern in input filter
            App.SetFilterText("Filter Text");

            // And clicks filter export button
            App.ClickFilterExportButton();
            Thread.Sleep(1 * 1000);

            // And and sets a name for the created pattern
            App.SetMessagePatternText(1, "1");
            Thread.Sleep(2 * 1000);

            // Then then a message pattern is created
            Assert.True(App.GetMessagePatternCount() == 1);
        }

        //** Scenario: Selecting a message pattern **//
        [Test]
        public void SelectingLogMessagePattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User selects a message pattern by clicking a checkbox
            App.SetFilterText("Line1");
            App.ClickFilterExportButton();
            App.SetMessagePatternText(1, "1");

            App.SetFilterText("Line2");
            App.ClickFilterExportButton();
            App.SetMessagePatternText(2, "2");

            Thread.Sleep(1 * 1000);
            App.ClickMessagePatternCheckBox(1);
            Thread.Sleep(1 * 1000);
            App.ClickMessagePatternCheckBox(2);
            Thread.Sleep(2 * 1000);

            // Then the log text will be filtered
            Assert.True(App.getMainText() == "Line1\nLine2");
        }

        //** Scenario: Moving a message pattern into the Input Filter **//
        [Test]
        public void MovingLogMessagePatternToInputFilter([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User moves a message parttern into the input filter by clicking the '<-' button
            App.SetFilterText("Line1");
            App.ClickFilterExportButton();
            Thread.Sleep(2 * 1000);
            Assert.True(App.GetMessagePatternCount() == 1);
            App.ClickMessagePatternExport(1);

            // Then message pattern value will be moved into the input filter
            // And the message pattern will be removed from the Toolbar
            Thread.Sleep(2 * 1000);
            Assert.True(App.GetFilterText() == "Line1");
        }
    }
}

