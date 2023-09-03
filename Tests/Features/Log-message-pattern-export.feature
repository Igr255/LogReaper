Feature: Log message pattern export

	Background:
    	Given the User inserted a log
    	And one Message Pattern are created

	Scenario: Exporting selected patterns
	When the User selects a message pattern by clicking a checkbox
	And clicks the export button
	Then the export dialog will appear
	And the selected message patter will be exported in YAML format

	Scenario: Exporting without selected message patterns
	When the User does not select any message pattern
	And clicks the export button
	Then exported text will contain no events