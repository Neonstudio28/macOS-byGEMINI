# Animation performance budget

Keep decorative animations isolated from expensive application work. Avoid layout-triggering work inside animation callbacks, cancel timers on teardown, and test sustained interaction on lower-powered hardware.