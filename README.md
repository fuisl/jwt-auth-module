# Authentication

## How to use this submodule

```js
const { authRoutes, authenticateToken } = require('./modules/jwt-auth-module');

app.use('/api/auth', authRoutes);

// Example of using middleware
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "You are authenticated!" });
});
```
