# HoloNews 

<b>Global Social Media Network for international politics and news.</b>

A mix of Google News and Facebook

## <b>Fundamental Values</b>

#### 1. Unconditional Freedom of Speech
#### 2. Accountability for what you say
#### 3. Equal power for all users
#### 4. Free access to the network
#### 5. Human friendly design (http://humanetech.com)

## Description

This network does not only show articles from big media organisations but also allows normal every day citizen to post. However, users or organisations who want to post have to first verify their real identity. Everyone has the freedom to express their opinion freely but in turn they have to reveal their real identity. Posts will be deletable or can be edited but users will see a warning when something was deleted or edited.

## Potential Problems

- Users will abuse the platform by posting something unethical or illigeal not related to politics or news

## Architecture & Design

### User Types

outside reader/ normal user: <b>Y</b>

user with verified identity: <b>X</b>

- read: Y,X
- upvote: X
- comment: X
- post: X

### Technology Stack

- Network: Holochain
- Image/ Video Storage/Hosting: IPFS
- Identity Verification: Civic or Holochain
- Monetization: Oyster + Donations (ETH, BITCOIN, Currency on Holochain)


#### Zomes

- identity: responsible for identity verification
- monetization: provide a way to monetize content
- posting: post, comment and vote
