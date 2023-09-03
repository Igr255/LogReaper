/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Log-message-pattern-export.feature file.
 **/

using System;
using System.Threading;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using Microsoft.VisualStudio.TestPlatform.CommunicationUtilities;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Log-message-pattern-export")]
    public class MessagePatternExportTest : CommonTest
	{
        private string text = "Line1\nLine2\nLine3";

        // Background:
        //   Given the User inserted a log
        //   And one Message Pattern are created
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
        }

        //** Scenario: Exporting selected patterns **//
        [Test]
        public void ExportSelectedLogMessagePattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User selects a message pattern by clicking a checkbox
            App.ClickMessagePatternCheckBox(1);

            // And clicks the export button
            App.PressExportButton();

            // Then the export dialog will appear
            string exportText = App.GetExportText();

            // And the selected message patter will be exported in YAML format
            if (browserType == BrowserType.Chrome)
                Assert.True(exportText == "events:\n  TestPattern: Line2", $"Expected: events:\n  TestPattern: Line2, but was {exportText}");
            else
                Assert.True(exportText == "events:\n  TestPattern: Line2\n", $"Expected: events:\n  TestPattern: Line2, but was {exportText}");
        }

        //** Scenario: Exporting without selected message patterns **//
        [Test]
        public void ExportWithoutSelectingLogMessagePattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User does not select any message pattern
            App.PressExportButton();

            // And clicks the export button
            string exportText = App.GetExportText();

            // Then exported text will contain no events
            if (browserType == BrowserType.Chrome)
                Assert.True(exportText == "events: {}", $"Expected events:\n  TestPattern: Line2, but was {exportText}");
            else
                Assert.True(exportText == "events: {}\n", $"Expected events:\n  TestPattern: Line2, but was {exportText}");
        }
    }
}

