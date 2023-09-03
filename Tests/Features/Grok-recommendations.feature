Feature: Grok recommendations

  Background:
    Given the User inserted a log
    And the User selected a Grok set

  Scenario: Selecting recommended Grok
  When the User highlights text inside of the log
  Then a popup appears with Grok patterns matching the higlighted text.

  Scenario: Choosing a recommended Grok pattern
  Given: Popup is already visible
  When the User chooses a Grok pattern
  Then selected Grok pattern will be moved into the input filter

  Scenario: Chooseing 'Use as Regex' option
  Given: Popup is already visible
  When the User chooses a 'Use as Regex'
  Then the hightlighted text will be moved into the input filter as Parametrized Regex