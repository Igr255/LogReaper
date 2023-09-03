Feature: Application mode display

	Scenario: Filtering the log trough Input Filter
	When the User writes a text inside of the Input filter
	Then the application mode will be set to Filter Mode

	Scenario: Filtering the log trough Message Patterns
	Given: a Message Pattern is created
	When the User selects a Message Pattern from the Toolbar
	Then the application mode will be set to Filter Mode

	Scenario: Editing the log
	Given a Message Pattern is created
	And Input Filter is not empty
	When text is inside of the Input Filter is removed
	And no Message Pattern is selected
	Then the application mode will be set to Edit Mode
