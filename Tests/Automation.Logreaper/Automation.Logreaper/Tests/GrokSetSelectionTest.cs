/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Grok-set-selection.feature file.
 **/

using System;
using Automation.Webs.WebObjects;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Grok-set-selection")]
    public class GrokSetSelectionTest : CommonTest
	{
        // Background:
        // Given a Grok pattern in input filter that exists in one of the Grok sets
        [SetUp]
        public void SetUp()
        {
            App.SetMainText("1.1.1.1");
            App.SetFilterText("%{IP}");
        }

        //** Scenario: Deselecting a pattern set **//
        [Test]
        public void InvalidGrokPatternTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User deselects a Grok set that contains the pattern inside of the input filter
            App.SelectGrokSet("Grok");
            Thread.Sleep(2 * 1000);
            App.SelectGrokSet("Grok");
            Thread.Sleep(2 * 1000);

            // Then the pattern will not get validated
            int grokCount = App.GetValidGrokCount();
            Assert.True(grokCount == 0);

            Assert.True(App.getMainText() == "");
        }

        //** Scenario: Selecting a pattern set **//
        [Test]
        public void ValidGrokPatternTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User selects a Grok set that contains the pattern inside of the input filter
            App.SelectGrokSet("Grok");
            Thread.Sleep(2 * 1000);

            // Then the pattern will get validated
            int grokCount = App.GetValidGrokCount();
            Assert.True(grokCount == 1);

            // And the log will be filtered
            Assert.True(App.getMainText() == "1.1.1.1");
        }
    }
}

