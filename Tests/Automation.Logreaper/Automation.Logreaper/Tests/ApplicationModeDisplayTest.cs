/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Application-mode-display.feature file.
 **/

using System;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Application-mode-display")]
    public class ApplicationModeDisplayTest : CommonTest
    {
        //** Scenario: Filtering the log trough Input Filter **//
        [Test]
        public void FilterModeInputFilterTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User writes a text inside of the Input filter 
            App.SetFilterText("Filter text");
            Thread.Sleep(2 * 1000);
            string returnedText = App.GetEditorMode();

            // Then the application mode will be set to Filter Mode
            Assert.True(returnedText == "Filter mode");
        }

        //** Scenario: Editing the log **//
        [Test]
        public void EditModeTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given a Message Pattern is created
            App.SetFilterText("Filter text");
            App.ClickFilterExportButton();
            Thread.Sleep(1 * 1000);

            // And Input Filter is not empty
            string returnedText = string.Empty;
            App.SetFilterText("Filter text");
            Thread.Sleep(2 * 1000);
            returnedText = App.GetEditorMode();
            Assert.True(returnedText == "Filter mode");

            // When text is inside of the Input Filter is removed
            // And no Message Pattern is selected
            App.SetFilterText("");
            Thread.Sleep(2 * 1000);

            // Then the application mode will be set to Edit Mode
            returnedText = App.GetEditorMode();
            Assert.True(returnedText == "Edit mode");
        }

        //** Scenario: Filtering the log trough Message Patterns **//
        [Test]
        public void FilterModeMessagePatternTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given: a Message Pattern is created
            App.SetFilterText("Filter text");
            App.ClickFilterExportButton();
            Thread.Sleep(1 * 1000);

            // When the User selects a Message Pattern from the Toolbar
            App.ClickMessagePatternCheckBox(1);
            Thread.Sleep(2 * 1000);

            // Then the application mode will be set to Filter Mode
            string returnedText = App.GetEditorMode();
            Assert.True(returnedText == "Filter mode");
        }
    }
}

