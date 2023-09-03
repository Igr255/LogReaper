/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Grok-recommendations.feature file.
 **/

using System;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Grok-recommendations")]
    public class GrokRecommendationTest : CommonTest
	{
        // Background:
        //   Given the User inserted a log
        //   And the User selected a Grok set
        [SetUp]
        public void SetUp()
        {
            App.SelectGrokSet("Grok");
            App.SetMainText("1.1.1.1");
        }

        //** Scenario: Selecting recommended Grok **//
        [Test]
        public void PopupShowTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User highlights text inside of the log
            App.HighlightMainText();
            Thread.Sleep(3 * 1000);

            // Then a popup appears with Grok patterns matching the higlighted text.
            Assert.True(App.IsPopupVisible());
        }

        //** Scenario: Choosing a recommended Grok pattern **//
        [Test]
        public void PopupUseGrokTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given: Popup is already visible
            App.HighlightMainText();
            Thread.Sleep(3 * 1000);
            Assert.True(App.IsPopupVisible());

            // When the User chooses a Grok pattern
            App.PopupUseGrok("IP");
            Thread.Sleep(2 * 1000);

            // Then selected Grok pattern will be moved into the input filter
            string text = App.GetFilterText();
            Thread.Sleep(2 * 1000);
            Assert.True(text == "%{IP}");
        }

        //** Scenario: Chooseing 'Use as Regex' option **//
        [Test]
        public void PopupUseAsRegexTest([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // Given: Popup is already visible
            App.HighlightMainText();
            Thread.Sleep(3 * 1000);
            Assert.True(App.IsPopupVisible());

            // When the User chooses a 'Use as Regex'
            App.PopupUseAsRegex();
            Thread.Sleep(2 * 1000);
            string text = App.GetFilterText();

            // Then the hightlighted text will be moved into the input filter as Parametrized Regex
            Thread.Sleep(2 * 1000);
            Assert.True(text == "%{r(1\\.1\\.1\\.1):_}");
        }
    }
}

