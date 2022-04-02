# The Simplistic Password Manager

A simple password manager that I wrote. Hopefully secure, although no guarantees
:)

> I am not a cryptography expert - although I have some knowledge on it from
> studying a little cybersecurity and doing some CTFs

It encrypts the passwords locally (using your master password) before sending
them to firebase - so theoretically even if google was hacked they wouldn't have
your passwords.

To compile the typescript install deno and run
`deno bundle -c deno.jsonc src/index.ts public/index.js`

To host the server for development just use a simple http server like
`python3 -m http.server 8080`
