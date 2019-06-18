// const Err = (msg) => {
//   if (msg) if (msg.name) console.log(msg);
//   return { success: false, message: msg };
// };

function Err(msg) {
  if (msg) if (msg.name) console.log(msg);
  return { success: false, message: msg };
}

const Success = (data) => {
  if (!data) return { success: true };
  return { success: true, data };
};


module.exports = {
  Err,
  Success
};