import React, { useCallback, useEffect, useRef, useState } from 'react';
import Reactions from '../Reactions';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import { reactionOnPostRequest } from '../../../action/UserAction';
import { connect } from 'react-redux';
import { ReactionsContext } from './ReactionsContext';

const ReactionsProvider = ({ reactionOnPostRequest, children }) => {
  const [pendingReacts, setPendingReacts] = useState({});
  const pendingReactsRef = useRef();
  pendingReactsRef.current = pendingReacts;

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const resetQueue = key => {
    setPendingReacts(old => {
      return {
        ...old,
        [`${key}`]: 0,
      };
    });
  };

  const incrementQueue = key => {
    setPendingReacts(old => {
      return {
        ...old,
        [`${key}`]: old[key] ? old[key] + 1 : 1,
      };
    });
  };

  const setQueueToOne = key => {
    setPendingReacts(old => {
      return {
        ...old,
        [`${key}`]: 1,
      };
    });
  };

  const trySend = (reactId, postId, toReset) => {
    // Check if theres a queue
    const key = getPendingReactKey(reactId, postId);
    const currentQueueValue = pendingReactsRef.current[key];

    if (!currentQueueValue) {
      sendReactRequest(reactId, postId);
    } else {
      incrementQueue(key);
    }
  };

  const handleRemainingStateChanges = (reactId, postId) => {
    const key = getPendingReactKey(reactId, postId);
    const currentQueueValue = pendingReactsRef.current[key];

    if (currentQueueValue && currentQueueValue % 2 === 0) {
      sendReactRequest(reactId, postId);
    } else {
      resetQueue(key);
    }
  };

  const removePendingReact = (reactId, postId) => {
    setPendingReacts(old => {
      return {
        ...old,
        [`${getPendingReactKey(reactId, postId)}`]: false,
      };
    });
  };

  const getPendingReactKey = (reactId, postId) => {
    return `${reactId}##${postId}`;
  };

  const sendReactRequest = (reactId, postId) => {
    const key = getPendingReactKey(reactId, postId);
    let reactionObject = {
      post_id: postId,
      text: Reactions[reactId].oldText,
      text_match: Reactions[reactId].map,
    };

    isInternetConnected()
      .then(() => {
        setQueueToOne(key);
        reactionOnPostRequest(reactionObject);
        wait(5000).then(() => {
          handleRemainingStateChanges(reactId, postId);
        });
      })
      .catch(() => {
        toast('Error', 'Please Connect To Internet');
      });
  };

  function hitReact(reactId, postId) {
    trySend(reactId, postId);
  }

  const isPending = useCallback((reactId, postId) => {
    const key = getPendingReactKey(reactId, postId);
    const currentQueueValue = pendingReactsRef.current[key];
    return currentQueueValue;
  }, []);

  return (
    <ReactionsContext.Provider
      value={{
        hitReact,
        isPending,
      }}>
      {children}
    </ReactionsContext.Provider>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    reactionOnPostRequest: payload => {
      dispatch(reactionOnPostRequest(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactionsProvider);
