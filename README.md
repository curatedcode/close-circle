# Close Circle (Facebook Clone)

This is my take on a social networking site. Influenced heavily by Facebook.

You can follow other users, publish posts, like and comment on other users' posts, share the post with a link, and scroll for hours on an infinite timeline. Additionally, no site would be complete without it, dark mode.

## Screenshots (dark mode)

![Homepage](https://i.postimg.cc/Dzf3c2jT/homepage.png)
![Post Modal](https://i.postimg.cc/63ysDMxb/post-modal.png)
![Profile Page](https://i.postimg.cc/438kLrqh/profile-page.png)

### How To Deploy Project Locally

1. This project requires you to have Node.js installed, refer to [their website](https://nodejs.org/en/download/) on how to get it installed.

2. Clone this repo to your local machine with one of the commands below. You can also read the GitHub documentation on [cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

```
# If you have SSH set up with Git:
git clone git@github.com:curatedcode/battleship.git

# For HTTPS:
git clone https://github.com/curatedcode/battleship.git

# Finally, GitHub CLI:
gh repo clone curatedcode/battleship
```

3. `cd` into the directory of your local clone.

4. Install the required packages

```
pnpm install
```

5. Create a `.env` file and fill it out with all the required variables listed in `.env.example`.

6. Push the prisma schema to your database

```
pnpm prisma db push
```

7. Finally build and start the app

```
pnpm build
pnpm start
```
