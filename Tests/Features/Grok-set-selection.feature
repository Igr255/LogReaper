Feature: Grok set selection

	Background:
    	Given a Grok pattern in input filter 
    	that exists in one of the Grok sets

	Scenario: Selecting a pattern set
	When the User selects a Grok set that contains 
		the pattern inside of the input filter
	Then the pattern will get validated
	And the log will be filtered

	Scenario: Deselecting a pattern set
	When the User deselects a Grok set that contains 
		the pattern inside of the input filter
	Then the pattern will not get validated
	And the log will not be filtered