import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  getUser,
  getUsers,
  createUser,
  getThread,
  getThreads,
  getComments,
  createComment
} from './database'

const commentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment made by a user',
  fields: () => ({
    author: {
      type: userType,
      description: 'The user that made the comment',
      resolve: ({_author}) => getUser({ _id: _author })
    },
    text: {
      type: GraphQLString,
      description: 'The content of te comment'
    },
    thread: {
      type: threadType,
      description: 'The thread this comment belongs to.',
      resolve: ({_thread}) => getThread({_id: _thread})
    }
  })
})

const threadType = new GraphQLObjectType({
  name: 'Thread',
  description: 'A conversation thread',
  fields: () => ({
    title: {
      type: GraphQLString,
      description: 'Thread title.'
    },
    description: {
      type: GraphQLString,
      description: 'Description of thread.'
    },
    author: {
      type: userType,
      description: 'Creator of thread',
      resolve: ({_author}) => getUser({ _id: _author })
    },
    comments: {
      type: new GraphQLList(commentType),
      description: 'A list of comments within the thread.',
      resolve: ({_id}) => getComments({ _thread: _id })
    }
  })
})

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    username: {
      type: GraphQLString,
      description: 'Unique identifier for user'
    },
    firstName: {
      type: GraphQLString,
      description: 'First name of user'
    },
    lastName: {
      type: GraphQLString,
      description: 'Last name of user'
    },
    email: {
      type: GraphQLString,
      description: 'Email address of user'
    },
    comments: {
      type: new GraphQLList(commentType),
      description: 'All comments made by this user',
      resolve: ({_id}) => getComments({_author: _id})
    },
    threads: {
      type: new GraphQLList(threadType),
      description: 'All threads made by this user',
      resolve: ({_id}) => getThreads({_author: _id})
    }
  })
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      args: {
        limit: {
          name: 'limit',
          type: GraphQLInt
        }
      },
      resolve: (root, {limit}) => getUsers({limit})
    },
    user: {
      type: userType,
      args: {
        username: {
          name: 'username',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, {username}) => getUser({username})
    },
    comments: {
      type: new GraphQLList(commentType),
      args: {
        limit: {
          name: 'limit',
          type: GraphQLInt
        }
      },
      resolve: (root, {limit}) => getComments({limit})
    },
    threads: {
      type: new GraphQLList(threadType),
      args: {
        limit: {
          name: 'limit',
          type: GraphQLInt
        }
      },
      resolve: (root, {limit}) => getThreads({limit})
    }
  })
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Unique identifier for user'
        },
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'First name of user'
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Last name of user'
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Email address of user'
        }
      },
      resolve: (root, args) => createUser(args)
    },
    createComment: {
      type: commentType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Author of comment'
        },
        text: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Comment text'
        }
      },
      resolve: (root, args) => createComment(args)
    }
  })
})

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
