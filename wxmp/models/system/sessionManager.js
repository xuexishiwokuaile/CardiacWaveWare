import { HTTP } from '../../utils/http-p.js'
import {config} from "../../config.js";
import { UserDto } from '../dto/userDto.js';

/**
 * 对应的登录使用的模块
 */
class SessionManager extends HTTP{

  /**
   * 判断当前用户是否登录(此方法为私有方法)
   */
  _checkLogin = function(){
    return this.request({
      url: 'CoreService/checkLogin',
      data: 'userId='+this.getUserId()+'$^@^$userToken='+this.getUserToken(),
      method: 'POST'
    });
  }

  /**
   * 判断当前用户是否登录（如果未登录返回相应的欢迎界面）
   */
  checkLogin = function(){
    this._checkLogin().then(res=>{
      if(res.trim().indexOf('ok')<0){
        wx.redirectTo({
          url: config._bootPage,
        });
      }
    });
  }

  /**
   * 调协相应的用户信息
   * @param {UserDto} userDto 需要保存的用户信息
   */
  setUserDto = function(userDto) {
    wx.setStorageSync(config._systemUserDto, userDto);
  }

  /**
   * 获取相应的用户ID
   * @returns {UserDto} 返回相应的userDto数据
   */
  getUserDto = function() {
    let userDto = new UserDto();
    userDto = wx.getStorageSync(config._systemUserDto)
    return userDto;
  }

  /**
   * 保存相应的用户id(缓存中的id)
   * @param {String} strUserId 需要保存的对应的userId
   */
  setUserId = function(strUserId){
    wx.setStorageSync(config._systemUserId, strUserId)
  }

  /**
   * 获取系统当中保存对应的userId
   */
  getUserId = function(){
    const strReturn = wx.getStorageSync(config._systemUserId);
    return strReturn;
  }

  /**
   * 保存相应的用户id(表中的id)
   * @param {String} strLoginId 需要保存的对应的Id
   */
  setLoginId = function(strLoginId){
    wx.setStorageSync(config._systemLoginId, strLoginId)
  }

  /**
   * 获取相应的用户信息
   */
  getUserInfo = function(){
    const strReturn = wx.getStorageSync(config._systemUserInfo);
    return strReturn;
  }

  /**
   * 保存相应的用户id(表中的id)
   * @param {Object} strUserInfo 需要保存的对应的Id
   */
  setUserInfo = function(strUserInfo){
    wx.setStorageSync(config._systemUserInfo, strUserInfo)
  }

  /**
   * 获取相应的用户id(表中的id)
   */
  getLoginId = function(){
    const strReturn = wx.getStorageSync(config._systemLoginId);
    return strReturn;
  }

  /**
   * 保存相应的用户Token(缓存中的Token)
   * @param {String} strUserToken 需要保存的对应的userToken
   */
  setUserToken = function(strUserToken){
    wx.setStorageSync(config._systemUserToken, strUserToken)
  }

  /**
   * 获取系统当中保存对应的userToken
   */
  getUserToken = function(){
    const strReturn = wx.getStorageSync(config._systemUserToken)
    return strReturn;
  }

  /**
   * 退出系统，清理缓存当中所有对应的人员信息和相应的用户信息
   */
  logout = function(){
    this.setUserDto(null);
    this.setUserId('');
    this.setUserToken('');
    this.setUserInfo(null)
  }
}

export {SessionManager};

