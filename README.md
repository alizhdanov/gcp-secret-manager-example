# Google Secret Manager Demo

Repository with examples of how to fetch secrets

## Simple (All in one)

The easiest one. Basically have `.env` file as a secret value.

**Advantages:** Easy to manage. Cheap.

**Disadvantages:** All secrets bind together, versioning doesn't really make sense, cause it's hard to follow what has changed

1. Create secret and add version through GCP console

2. Create a script to fetch secrets and move them into `.env` file

## Labeling

The most logical and probably the best solution.

**Advantages:** Easy to follow

**Disadvantages:** Can be pricey. If you're not destroying versions. A bit trickier to manage

1. Create secret and add version through GCP console.

2. Assign apropriate labels for needed secrets

3. Create a script to fetch needed secrets and move them into .env file

## On Demand

Another option similar to labeling, but with needed values stored in code

**Advantages:** Easy to follow

**Disadvantages:** Can be pricey. If you're not destroying versions. A bit trickier to manage. New PR every time you wanna add new secret.

1. Create secret and add version through GCP console.

2. Create list of needed secrets

3. Create a script to fetch needed secrets and move them into .env file
