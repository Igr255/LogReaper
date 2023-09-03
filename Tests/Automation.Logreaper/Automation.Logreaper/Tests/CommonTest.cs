/**
 * author: Igor Hanus <xhanus19@stud.fit.vutbr.cz>
 * brief: Class for setting up browsers used in individual steps.
 **/

using System;
using Automation.Logreaper.WebObjects;
using Automation.Webs.WebObjects;
using NUnit.Framework;

namespace Automation.Logreaper.Tests
{
    public class CommonTest
    {   
        private static List<BrowserType> _browsers { get; } = new List<BrowserType> { BrowserType.Chrome, BrowserType.Safari };
        private BrowserType _browserType;
        private App _app;

        public App App { get { return _app; } }
        public static List<BrowserType> Browsers { get { return _browsers; } }

        [SetUp]
        public void SetUp()
        {
            // initialize driver for test
            _browserType = (BrowserType)TestContext.CurrentContext?.Test.Arguments[0];
            _app = new App(_browserType);
        }

        [TearDown]
        public void TearDown()
        {
            App.Kill();
        }
    }
}

