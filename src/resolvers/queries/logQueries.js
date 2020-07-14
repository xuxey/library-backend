const Log = require("../../models/log")

const allLogs = async (root, args) => {
    if (args.userId)
        return Log.find({user: args.userId})
            .populate('user')
            .populate('book')
            .sort({time: 'desc'})
            .exec()
    return await Log.find({})
        .populate('user')
        .populate('book')
        .sort({time: 'desc'})
        .exec()
}

module.exports = {allLogs}
