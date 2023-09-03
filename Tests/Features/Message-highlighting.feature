Feature: Log message highlight

	Background:
    	Given the User inserted a log
    	And two log message patterns are created

	Scenario: Highlighting log messages using one message pattern
	When the User selects a message pattern by clicking a checkbox
	Then the matched log messages will be highlighted with a light red bar

	Scenario: Highlighting log messages using multiple message patterns
	When the User selects two message patterns by clicking their checkboxes
	Then the matched log messages will be highlighted with a darker red bar