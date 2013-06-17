easy-deploy
===========


# Install 

```
git clone https://github.com/easylogic/easy-deploy.git

cd easy-deploy

npm install 

jam install   # jamjs 
```

# Run 

```

cd easy-deploy && node app.js 

```

# Config 

```javascript 
// in utils/command.js 
var config = {
  root : './dist',  // svn checkout directory 
	auth :  { 
		id : '',    // svn id 
		pass : ''   // svn pass 
	}
}
```
