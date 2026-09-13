# Resource cleanup

Any timer, animation loop, subscription, or external resource created by a view needs a corresponding teardown path. Reopen and close workflows repeatedly during QA to catch accumulated listeners or stale callbacks.