FROM       onfinality/subql-node:v3.4.1
COPY       . .
USER       node
CMD        ["-f","/app"]