const NodeRSA = require('node-rsa');
const key = new NodeRSA(`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChpbeWhDtr87Hg
zTJcDHcu0qfrj1bPbhhr4sx7XEBet7Fa6Oolu1Kb6cDiqoeARaWQVzm2J1j56534
F65jPOskLJkGeDnL6AgUiFV1Iel2AuOVxEO55qcbECQr8nU/c0FHjrfApmxRmWAS
dabKNwX2no4IOiJDyfWreRLwZWqY3pfAScO9SmjF2CHJZHLjrY/CI4c8l4lKB1a4
Ve9YbJd1Z9tysIQDJiXn1+0sLRhW1Rqv0aeo1u0+e0qTn0w6Nf2rdXkjLEgadYtM
InzNaVi1o3ERvAOhkvdaJ0Uc5xeoyJmNWxrBjAmgo7OoUSCMdCiuXaD2zHX5jRXM
n574t4tzAgMBAAECggEAVy+eudxQgIVMZ8fFZciDcAnG8FK7q93h5i7Jw6+aOHwz
eKkvwXIruFR36Mm5lAH8rsGdKxZF82aWKX38XSI6YaR8VPT7l3NrCEgQb8D+vtwI
DHtzXA2ADCTEnb+EZdiwWPwtOAeLXOew3cP/VgofeUlDqkRQvudrTjVbdbX9rL1m
/rP6nA/U8OA02ovHAkCgGIzZw2Rvb4i4+RyZcm8pHEMrBrvdDweGJqMuynMH/khj
HUMhUc9Uz9jIbEVMWZiR3pscHxiXQqB+RR4vW16sIO7kjMZUsPfJvk3rM7LFOR+E
wqjFz4oCJ8azwHIXvBsd0E1XcDiiPs8lq1pTUB0KIQKBgQDN91z3p+FrpzG+tEsC
8jtgCEmkWnFKb2UBOdSK+ri7XIO6I5tCupW4MTaFSn+YyP/mFn5B6E1BZOZW95I/
hpNyQUjuJPxF5y7mQ7VwRio7h7rpx0D1gP46JBMy7yBtrYjwLzkzOKLCj3XhszJm
0lwmM0OgMyx8OXmxWcDP+ah6jQKBgQDI6j80bhiIxlCY1EMN++CoWEa8RAyO9C8I
goy6utziIIILvfwcgC4+ZCVSHSrFnuv+eQJLU1HMw8kYEvTp8mAX5FRiembjUyw3
5QW93az37YvJofJPdSrWXshOTpVwVWyUO8OT3qk+XQr5RlYGtf0N9POmVxsp0Gd8
eZdZ+PGd/wKBgFHf9zDrp4xn1jp86SSurjOql7uhyE9SoNAv8PGeYTj5udOQu/N2
wHWL+qRZzQcrP65zWpVQhwVr2rTPjW97S7mrghZI1Y/kKpyWZdXPzpIDjqXH82ak
dGsgVBF3RWjUBw+TdiWKagj1hmLGHU8KaF83GbbhINnw7xM1HpSOJg8xAoGAOmwr
PuK4zaTlMNugOAPDGxC4WOxsvnDw8EeOBoppynNrfWCcW+lGCSxz0cHbeyWwOAoW
CbNLuQBBjHeOsiyhlrD1fMFdA8Neu04kckZwkpOHr3UhEcvfTgC3vFWLjOO6NAyA
3ZHEovbJRx0VzNPEpvdQllED/A+21/I/eZEzKR8CgYEAuQucZlTr+PwdE4Josjb3
JJSNW0eYgunMUgpBB6k8qQGVYm4G9dPlEz3K/Xk5KowQDqaCkt7ZFqbpPq77x6X7
ep6D4kwQn7kZ4g3Vj3zcM6gOcNmc9/btDrZPubeEkFphPrn9HhOOT60TWVixb31K
aMWUOt8m/iH2biKXSyMv464=
-----END PRIVATE KEY-----`);

module.exports.decrypt = encryptedText => key.decrypt(encryptedText, 'utf8');
