

module.exports.dataToJson = data => {
  if (Array.isArray(data)) {
    return data.map(data => data.toJSON())
  } else {
    return data.toJSON()
  }
}

module.exports.sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports.onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}
