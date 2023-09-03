Feature: Filter highlight
	
	Background:
    	Given the User selected a Grok set

	Scenario: Create a single Grok pattern
	When the User creates a valid Grok pattern
	Then the Grok pattern will be highlighted

	Scenario: Create a single Regex pattern
  	When the User creates a Regex pattern
	Then the Regex pattern will not be highlighted

	Scenario: Create a single Parametrized Regex pattern
	When the User creates a valid Parametrized Regex pattern
	Then the Parametrized Regex pattern will be highlighted

	Scenario: Create a combination of patterns
	When the User creates a combination of a valid Grok, Regex 
	And the User creates a valid Parametrized Regex patterns
	Then the Grok and Parametrized Regex pattern will be highlighted