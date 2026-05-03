const store = require('../../utils/store');

Page({
  data: {
    authStatus: 'none',
    formData: {
      studentId: '',
      realName: '',
      school: '',
      campus: ''
    },
    currentStep: 1,
    errorMsg: ''
  },

  onLoad() {
    const me = store.getMe();
    this.setData({ authStatus: me.authStatus || 'none' });
  },

  onStudentIdInput(e) {
    this.setData({ 'formData.studentId': e.detail.value });
  },

  onNameInput(e) {
    this.setData({ 'formData.realName': e.detail.value });
  },

  onSchoolInput(e) {
    this.setData({ 'formData.school': e.detail.value });
  },

  onCampusInput(e) {
    this.setData({ 'formData.campus': e.detail.value });
  },

  nextStep() {
    const { formData } = this.data;

    if (!formData.studentId) {
      this.setData({ errorMsg: '请输入学号' });
      return;
    }
    if (!formData.realName) {
      this.setData({ errorMsg: '请输入真实姓名' });
      return;
    }
    if (!formData.school) {
      this.setData({ errorMsg: '请输入学校名称' });
      return;
    }

    this.setData({ errorMsg: '', currentStep: 2 });
  },

  prevStep() {
    this.setData({ currentStep: 1 });
  },

  submitAuth() {
    const { formData } = this.data;

    if (!formData.studentId || !formData.realName || !formData.school) {
      this.setData({ errorMsg: '请填写完整信息' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    try {
      store.submitAuth({ ...formData });
      const app = getApp();
      if (app && app.syncGlobalFromStore) app.syncGlobalFromStore();
      wx.hideLoading();
      wx.showToast({ title: '提交成功，等待审核', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '提交失败', icon: 'none' });
    }
  }
});
