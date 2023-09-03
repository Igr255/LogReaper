/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Filter-highlight.feature file.
 **/

using System;
using Automation.Webs.WebObjects;
using NUnit.Framework;
using static System.Net.Mime.MediaTypeNames;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Filter-highlight")]
    public class FilterHighlightTest : CommonTest
    {
        [SetUp]
        public void SetUp()
        {
            App.SelectGrokSet("Grok");
        }

        //** Scenario: Create a single Grok pattern **//
        [Test]
        public void CreateSingleGrokPattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a valid Grok pattern
            App.SetFilterText("%{IP}");
            Thread.Sleep(2 * 1000);

            //Then the Grok pattern will be highlighted
            int grokCount = App.GetValidGrokCount();
            Assert.True(grokCount == 1);
        }

        //** Scenario: Create a single Regex pattern **//
        [Test]
        public void CreateSingleRegexPattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a Regex pattern
            App.SetFilterText("1\\.1\\.1\\.1 -> 2\\.2\\.2\\.2");
            Thread.Sleep(2 * 1000);
            int paramReCount = App.GetValidParamReCount();

            // Then the Regex pattern will not be highlighted
            int grokCount = App.GetValidGrokCount();
            Assert.True(grokCount == 0);
            Assert.True(paramReCount == 0);
        }

        //** Scenario: Create a single Parametrized Regex pattern **//
        [Test]
        public void CreateSingleParamRegexPattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a valid Parametrized Regex pattern
            App.SetFilterText("%{r(\\d\\.\\d\\.\\d\\.\\d):srcip}");
            Thread.Sleep(2 * 1000);

            // Then the Parametrized Regex pattern will be highlighted
            int paramReCount = App.GetValidParamReCount();
            Assert.True(paramReCount == 1);
        }

        //** Scenario: Create a combination of patterns **//
        [Test]
        public void CreatePatternCombination([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a combination of a valid Grok, Regex
            // And the User creates a valid Parametrized Regex patterns
            App.SetFilterText("%{IP} -> %{r(\\d\\.\\d\\.\\d\\.\\d):dstip} User:%{WORD:user}");
            Thread.Sleep(2 * 1000);

            // Then the Grok and Parametrized Regex pattern will be highlighted
            int paramReCount = App.GetValidParamReCount();
            int grokCount = App.GetValidGrokCount();
            Assert.True(grokCount == 2);
            Assert.True(paramReCount == 1);
        }
    }
}

