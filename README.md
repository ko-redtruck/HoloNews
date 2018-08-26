# HoloNews 

<b>Global Social Network for international politics and news.</b>

## <b>Fundamental Values</b>

#### 1. Freedom of Speech
#### 2. Equality

## <b>Goals</b>

#### 1. Provide a equal, free and uncensored access to information 
#### 2. Prevent manipulation in elections
#### 3. Create a human friendly design (http://humanetech.com)

## Instructions

1. run hcdev web for backend api server 
2. run npm start in ui-src for the ui 
3. connect to localhost:8080


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

### Architecture

#### 1. Zomes 

- identity: responsible for identity verification
- monetization: provide a way to monetize content
- posting: post, comment and vote
