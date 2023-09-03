# LogReaper - log processing utility with GUI

A tool that allows user to create re, GROK or full-text patterns for filtering large amount of log records. It allows a creation of multiple patterns and their combinations, exporting patterns that can be used for plogchecker and saving filtered logs.

# Installation

In order to be able to run the application, Node.js and yarn are needed. You can download Node.js installer from the following [link](https://nodejs.org/en/download).

Once Node.js is installed, install yarn using the command:

#### `npm install --global yarn`

First install all dependencies, where `package.json` file is located (by default it is on the path `logreaper/App/log-reaper`), using the command:

#### `yarn`

Running the project on localhost:

#### `yarn start`

Building the project:

#### `yarn build`

# Usage

![](https://pajda.fit.vutbr.cz/testos/logreaper/-/raw/main/Design/lr.gif)


# Running automation

First you will need to have `dotnet SDK` installed from the following [link](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).
The tests run on both Chrome and Safari browsers. In case you do not have `Safari` browser, in the file `CommonTest.cs`, by deafult located on the path `logreaper/Tests/Automation.Logreaper/Automation.Logreaper/Tests/CommonTest.cd`, remove `BrowserType.Safari` from the list on the line 14.

The tests expect that the application runs on the URL `http://localhost:3000/`. If the URL differs it will need to be edited in the file `BrowserDriver.cs` on the line 43 located on the default path `logreaper/Tests/Automation.Logreaper/Automation.Logreaper/WebObjects/BrowserDriver.cs`.

Once you install the required SDK you can run all tests using the command: 

#### `dotnet test Automation.Logreaper.sln`.

### Running tests usign categories
Every test has a category named after the features listed in the section `Feature-test matrix` located at the bottom of this file. 

Test example that will run tests created based on the Application mode display and Filter higlight categories:

#### `dotnet test Automation.Logreaper.sln --filter 'TestCategory="Application-mode-display"|TestCategory="Filter-highlight"'`

These tests can also be run through IDEs like Visual Studio or Rider.

## Features

| Feature                       | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inserting log                 | The user is able to insert a log that they want to examine.                                                                                                                                                                                                                                                                                                                                 |
| Log message pattern creation  | The user can combine regular expressions, parametrized regular expressions and Grok patterns to create a single log message pattern.                                                                                                                                                                                                                                                        |
| Text filtering                | The text is filtered real-time, when a vadil expression is passed in the input filter.                                                                                                                                                                                                                                                                                                      |
| Grok recommendations          | When text inside of the loaded log is highlighted, the user is given multiple options for Grok patterns they can use. Upon selecting a pattern, it is then moved into the input filter component. User receives recommendation from the selected Grok pattern sets. Another possibility is to use the selected text as a regular expression.                                                |
| Managing log message patterns | The user can change the name of created patterns, use them to filter text and export them.                                                                                                                                                                                                                                                                                                  |
| Log message highlight         | When a single log message pattern or their combination is selected, every matched message inside of the inserted log will get a hit-box. Hit-box is a red line at the start of every matched message. This line indicates, that multiple log message patterns matched the exact same log message.                                                                                           |
| Pattern export                | Once the user is satisfied with their created log message patterns, they are able to export them as individual events used for Plogchecker in YAML format. The names of the log message patterns are used to define the names of individual events.                                                                                                                                         |
| Grok set selection            | The app lets the user choose Grok sets which they want to use. These Grok sets contain a collection of Grok patterns with a specific use. These sets are used to create recommendations for highlighted text, as they provide individual Grok patterns.                                                                                                                                     |
| Filtered log messages counter | The total amount of messages inside of the inserted log is displayed when the app is loaded. Once the user starts filtering the log, they will be informed how many messages have been matched out of all messages.                                                                                                                                                                         |
| Application mode display      | The application works with two modes. These modes are editing mode and filtering mode. When the user starts applying filters to the inserted log, the app goes into filtering mode, letting the user working with the copy of the original log. If the user wants to edit the document, they can simply remove all active log message patterns and delete the contents of the input filter. |

## Feature covering matrix

| Feature                       | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  | 27  | 28  |
| ----------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inserting log                 |     |     |     | X   | X   | X   |     |     | X   | X   | X   | X   | X   | X   | X   | X   | X   |     |     |     |     | X   | X   | X   | X   | X   |     | X   |
| Filter highlight              |     | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   | X   | X   | X   | X   | X   | X   | X   |     | X   |
| Text filtering                | X   |     |     |     |     |     | X   | X   |     |     |     | X   | X   | X   | X   |     |     |     |     |     |     | X   |     |     |     |     |     |     |
| Grok recommendations          |     |     |     | X   | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Managing log message patterns |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   |     |     |     | X   |     |
| Log message highlight         |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   |     |     |     | X   |
| Pattern export                |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   |     |     |
| Grok set selection            |     |     |     |     |     |     | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Filtered log messages counter |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   |     |     |     |     |     |     |     |     |     |     |     |
| Application mode display      | X   | X   | X   |     |     |     |     |     |     | X   | X   |     |     |     |     |     | X   |     |     |     |     |     |     |     |     |     |     |     |

## Feature-test matrix

| Feature file                           | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  | 27  | 28  |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Application-mode-display.feature       | X   | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Grok-recommendations.feature           |     |     |     | X   | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Grok-set-selection.feature             |     |     |     |     |     |     | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Insert-log.feature                     |     |     |     |     |     |     |     |     | X   | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Log-filtering.feature                  |     |     |     |     |     |     |     |     |     |     |     | X   | X   | X   | X   |     |     |     |     |     |     |     |     |     |     |     |     |     |
| Log-message-counter.feature            |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   |     |     |     |     |     |     |     |     |     |     |     |
| Filter-highlight.feature               |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   | X   | X   |     |     |     |     |     |     |     |
| Log-message-pattern-operations.feature |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   |     |     |     | X   |     |
| Message-highlighting.feature           |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   |     |     |     | X   |
| Log-message-pattern-export.feature     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | X   | X   |     |     |
