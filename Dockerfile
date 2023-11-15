# The parent image already includes user setup, package installation, etc.
FROM       onfinality/subql-node:v3.4.1
COPY       . .
USER       node
CMD        ["-f","/app"]