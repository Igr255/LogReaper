/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Log-message-counter.feature file.
 **/

using System;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using NUnit.Framework;
using OpenQA.Selenium.DevTools;
using SeleniumExtras.PageObjects;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Log-message-counter")]
    public class LogMessageCounterTest : CommonTest
	{
        // Background:
        //   Given the User inserted a log
        [SetUp]
        public void SetUp()
        {
            App.SetMainText("Line1\nLine2\nLine3");
            Thread.Sleep(2 * 1000);
        }

        //** Scenario: Editing the log **//
        [Test]
        public void LogEdit([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given the application is in Edit Mode
            Assert.True(App.GetEditorMode() == "Edit mode");

            // When the User edits the log
            App.SetMainText("Line3-new");
            Thread.Sleep(2 * 1000);

            // Then the counter will update both filtered and total lines
            Assert.True(App.GetMessageCounterValue() == "3 / 3");
        }

        //** Scenario: Filterng the log **//
        [Test]
        public void LogFilter([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User filters the log
            App.SetFilterText("Line2");
            Thread.Sleep(2 * 1000);

            // Then the counter will show 
            // how many log messages have been filtered out of total messages
            Assert.True(App.GetMessageCounterValue() == "1 / 3");
        }
    }
}

