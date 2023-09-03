/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Tests created based for the Log-filtering.feature file.
 **/

using System;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    [TestFixture]
    [Category("Log-filtering")]
    public class LogFilteringTest : CommonTest
    {
        string longString = "203.35.135.165 [2016-03-15T12:42:04+11:00] \"GET memz.co/cloud/\" 304 962 0 - 0.003 [MISS] \"-\" \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36\"";
        private string text = "1.1.1.1 -> 2.2.2.2 User:John";

        // Background: 
        //  Given the User inserted a log
        //  And the User selected a Grok set
        [SetUp]
        public void SetMainText()
        {
            App.SetMainText(text + "\n" + longString);
            App.SelectGrokSet("Grok");
        }

        //** Scenario: Create a single Grok pattern **//
        [Test]
        public void CreateSingleGrokPattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a Grok pattern
            App.SetFilterText("%{IP}");
            Thread.Sleep(2 * 1000);

            // Then unmatched log messages will be filtered
            Assert.True(App.getMainText() == text + "\n" + longString);

            App.SetFilterText("%{IP:srcip}");
            Thread.Sleep(2 * 1000);

            Assert.True(App.getMainText() == text + "\n" + longString);

            App.SetFilterText("%{IPV6:srcip}");
            Thread.Sleep(2 * 1000);

            Assert.True(App.getMainText() == "");
        }

        //** Scenario: Create a single Regex pattern **//
        [Test]
        public void CreateSingleRegexPattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a Regex pattern
            App.SetFilterText("1\\.1\\.1\\.1 -> 2\\.2\\.2\\.2");
            Thread.Sleep(2 * 1000);

            // Then unmatched log messages will be filtered
            Assert.True(App.getMainText() == text);

            
            App.SetFilterText("random text");
            Thread.Sleep(2 * 1000);

            Assert.True(App.getMainText() == "");
        }

        //** Scenario: Create a single Parametrized Regex pattern **//
        [Test]
        public void CreateSingleParamRegexPattern([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a Parametrized Regex pattern
            App.SetFilterText("%{r(\\d\\.\\d\\.\\d\\.\\d):srcip}");
            Thread.Sleep(2 * 1000);

            // Then unmatched log messages will be filtered
            Assert.True(App.getMainText() == text);

            App.SetFilterText("%{r(\\d\\.\\d\\.\\d\\.\\d)}");
            Thread.Sleep(2 * 1000);
            Assert.True(App.getMainText() == "");
        }

        //** Scenario: Create a combination of patterns **//
        [Test]
        public void CreatePatternCombination([ValueSource(nameof(Browsers))] BrowserType browserType)
        {
            // When the User creates a combination of Grok, Regex and Parametrized Regex patterns
            App.SetFilterText("%{IP} -> %{r(\\d\\.\\d\\.\\d\\.\\d):dstip} User:%{WORD:user}");
            Thread.Sleep(2 * 1000);

            // Then unmatched log messages will be filtered
            Assert.True(App.getMainText() == text);

            // Grok combination
            App.SetFilterText("%{IP:client} \\[%{TIMESTAMP_ISO8601:timestamp}\\] \"%{WORD:method} %{URIHOST:site}%{URIPATHPARAM:url}\" %{INT:code} %{INT:request} %{INT:response} - %{NUMBER:took} \\[%{DATA:cache}\\] \"%{DATA:mtag}\" \"%{DATA:agent}\"");

            Assert.True(App.getMainText() == longString);
        }
    }
}

