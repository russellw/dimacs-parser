Parser for the Dimacs file format.

```
dimacs = require('dimacs-parser')
p = dimacs.parse(text[, file])
```

Supplying the name of the file from which the text was read is optional; if given, it will be used in error messages.

The return value is an object with the following fields:

```
clauses
```

A conjunction of clauses, represented as terms in the form defined by the `clause-normal-form` package.

```
status
```

The SATLIB collection of Boolean satisfiability problems comments each problem with its status where this is known. If `dimacs-parser` finds such a comment in that format, it extracts and returns the status field. This is useful for testing solvers against a collection of known problems.
