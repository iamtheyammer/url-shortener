// const Err = (msg) => {
//   if (msg) if (msg.name) console.log(msg);
//   return { success: false, message: msg };
// };

function Err(msg, res) {
  if(!msg && res) return res.send({ success: false });
  if(!msg && !res) return { success: false, message: msg };
  if(msg && res) return res.send({ success: false, message: msg });
  if(msg && !res) return { success: false, message: msg};
}

const Success = (msg, res) => {
  if (!msg && res) return res.send({ success: true });
  if (!msg && !res) return { success: true, message: msg };
  if (msg && res) return res.send({ success: true, message: msg });
  if (msg && !res) return { success: true, message: msg };
};

const Forbidden = (res) => {
  return res.status(403).send(
    Err('Invalid session provided.')
  );
};

const Unauthorized = (res) => {
  return res.status(401).send(
    Err('No session provided.')
  );
};

const MustBeSuperAdmin = (res) => {
  return res.status(403).send(
    Err('You must be a super admin to do that.')
  );
};

const BadRequest = (data, res) => {
  if(!data) return res.status(400).send(Err());
  return res.status(400).send(Err(data));
}

module.exports = {
  Err,
  Success,
  Unauthorized,
  Forbidden,
  MustBeSuperAdmin,
  BadRequest
};