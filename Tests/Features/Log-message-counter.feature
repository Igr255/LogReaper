Feature: Log message counter

	Background:
      Given the User inserted a log

	Scenario: Filterng the log
	When the User filters the log
	Then the counter will show 
		how many log messages have been filtered out of total messages

	Scenario: Editing the log
	Given the application is in Edit Mode
	When the User edits the log
	Then the counter will update both filtered and total lines