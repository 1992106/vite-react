import gql from 'graphql-tag'

export const GET_USER_INFO = gql`
  query profile {
    profile {
      _id
      username
      nickname
    }
  }
`
