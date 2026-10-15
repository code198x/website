# Verification scripts

Use explicit semicolons for JavaScript statements, including statements inside
compact callbacks and `catch`/`finally` bodies. GitHub Code Quality checks this
against the prevailing convention in these scripts. Keep new scripts consistent
with it rather than relying on automatic semicolon insertion.

Keep verification evidence tied to the source revision that produced it. A style
correction does not justify rewriting archived results or claiming a fresh run.
