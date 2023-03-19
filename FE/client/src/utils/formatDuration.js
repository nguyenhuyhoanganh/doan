const handleTime = (sec) => {
    let min = Math.floor(sec/60)
    let second = sec - Math.floor(sec/60)*60
    return second < 10? min + ':0' + second : min + ':' + second
  }

  export default handleTime