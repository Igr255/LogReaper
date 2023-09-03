/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Insert-log.feature file.
 **/

using System;
using Automation.Webs.WebObjects;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Insert-log")]
    public class InsertingLogTest : CommonTest
	{
        //** Scenario: Insert a log **//
        [Test]
        public void InsertLog([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User inserts a log in the main text window
            App.SetMainText("Test text");

            // Then the Users can see the inserted log
            Assert.True(App.getMainText() == "Test text");
        }

        //** Scenario: Edit log in Edit Mode **//
        [Test]
        public void EditLogInEditMode([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given the User has already inserted a log
            App.SetMainText("Test text");
            Thread.Sleep(2 * 1000);
            // And the application is in Edit Mode
            Assert.True(App.GetEditorMode() == "Edit mode");

            // When the User edits the log
            App.SetMainText("NewText\nRandomValue\nTest");
            // Then the log will get edited
            Assert.True(App.getMainText() == "NewText\nRandomValue\nTest");
        }

        [Test]
        public void EditLogInFilterMode([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given the User has already inserted a log 
            App.SetMainText("Filter text");
            // And the application is in Filter Mode
            App.SetFilterText("Filter text");
            Thread.Sleep(2 * 1000);
            Assert.True(App.GetEditorMode() == "Filter mode");

            // When the User tries to edit the log
            Thread.Sleep(2 * 1000);
            try
            {
                App.SetMainText("NewText\nRandomValue\nTest");
            }
            catch (Exception) {}

            // Then the User will not be able to edit the log
            Assert.True(App.getMainText() == "Filter text");
        }
    }
}

