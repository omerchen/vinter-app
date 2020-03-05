export default milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
