Feature: Log filtering

  Background: 
    Given the User inserted a log
    And the User selected a Grok set

  Scenario: Create a single Grok pattern
  When the User creates a Grok pattern
  Then unmatched log messages will be filtered

  Scenario: Create a single Regex pattern
  When the User creates a Regex pattern
  Then unmatched log messages will be filtered

  Scenario: Create a single Parametrized Regex pattern
  When the User creates a Parametrized Regex pattern
  Then unmatched log messages will be filtered

  Scenario: Create a combination of patterns
  When the User creates a combination of Grok, Regex and Parametrized Regex patterns
  Then unmatched log messages will be filtered