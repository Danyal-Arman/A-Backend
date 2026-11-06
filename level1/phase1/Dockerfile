FROM node

# Working directory inside image

WORKDIR /app

# Files inside the working directory /app
# COPY package.json package.json
# COPY package-lock.json package-lock.json
# RUN npm install

# COPY index.js index.js

# optimized version of above for line
# (why optimized ? because this above 4 lines from 7 to 12 will be okay if project is small, but if big mern projects comes then isn't coping every file will become hectick)

# THis COPY package*.json .  tell to copy every file starts with package, and last . tells the working directory files going to be in, so in this case its /app
COPY package*.json . 
RUN npm install

# Here COPY . .  this means copy all the files and folders from source which is in this is level1 to the destination which is app directory.
COPY . .

CMD [ "node", "index.js" ]

