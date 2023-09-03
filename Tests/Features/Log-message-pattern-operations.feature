Feature: Log message pattern operations

	Background:
        Given the User inserted a log

	Scenario: Creating a message pattern and naming it
	When the User creates a pattern in input filter
	And clicks filter export button
	And and sets a name for the created pattern
	Then then a message pattern is created

	Scenario: Selecting a message pattern
	Given the User created two message patterns
	When the User selects message patterns by clicking their checkboxes
	Then the log text will be filtered

	Scenario: Moving a message pattern into the Input Filter
	When the User moves a message parttern into the input filter
		by clicking the '<-' button
	Then message pattern value will be moved into the input filter
	And the message pattern will be removed from the Toolbar