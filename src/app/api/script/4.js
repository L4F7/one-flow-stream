// Process endpoint #2 Testing
app.post('/compile', (req, res) => {
    // Process the input and echo it with a timestamp
    const timestampedText = `Echo from server: at ${new Date().toISOString()}: \n${req.body.text}`;
    console.log(timestampedText)
    res.json({ result: timestampedText });
  });