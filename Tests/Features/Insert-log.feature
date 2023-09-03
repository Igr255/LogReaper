Feature: Inserting log

    Scenario: Insert a log
      When the User inserts a log in the main text window
      Then the Users can see the inserted log

    Scenario: Edit log in Edit Mode
      Given the User has already inserted a log
      And the application is in Edit Mode
      When the User edits the log
      Then the log will get edited

    Scenario: Edit log in Filter Mode
      Given the User has already inserted a log 
      And the application is in Filter Mode
      When the User tries to edit the log
      Then the User will not be able to edit the log