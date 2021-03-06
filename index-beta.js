const napa = require('napajs');
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');
const providers = [ "napajs" ,  "webworker-threads"];

class Channel
{
  constructor()
  {
    this.emitter = new EventEmitter();
  }

  send(...data)
  {
    this.emitter.emit("data",...data);
  }

  receive(handler)
  {
    this.emitter.on("data",handler);
  }
}

module.exports = (size = 8) =>
{
  const tpool = napa.zone.create( `GO_THREAD_POOL: ${uuidv4()}` , { workers: size });
  const store = napa.store.create('GO_STORE');
  const mapping = {};
  const registry = {};
  let counter = 0;

  Global Code Provided by the library to every Goroutine
  function getChannel(id)
  {
    const store = global.napa.store.get('GO_STORE');
    return store.get(id);
  }

  tpool.broadcast(getChannel.toString());

  function go(task,...params)
  {
    if(chan)
    {
        const id = ""+uuidv4(counter);
        mapping[id] = [new Channel(), new Channel()] ;
        store.set(id, mapping[id]);
        return [...mapping[id],tpool.execute(task,[id])];
    }
    else
    {
      if(params != undefined)
      {
        return tpool.execute(task,params);
      }
      else
      {
        return tpool.execute(task);
      }
    }
  }

  function getPoolSize()
  {
    return size;
  }

  function register(id,func)
  {
    registry[id] = func;
  }

  function deregister(id)
  {
    delete registry[id];
  }

  function get(id)
  {
    return registry[id];
  }

  function addLib(code_string)
  {
    tpool.broadcast(a);
  }


  return {
    go:go,
    getPoolSize:getPoolSize,
    register:register,
    deregister:deregister,
    get:get,
    addLib:addLib,
    Channel:Channel
  }
};
